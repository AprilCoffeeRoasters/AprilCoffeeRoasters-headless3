import { gql } from "graphql-request";
import type {
  CoffeeInfoCoffee,
  CoffeeInfoFarm,
  CoffeeInfoPhoto,
} from "lib/coffee-info/content";
import {
  datoRequest,
  isDatoCmsConfigured,
  type DatoResponsiveImage,
} from "lib/cms/datocms";

export { isDatoCmsConfigured };

/**
 * DatoCMS setup (minimal):
 *
 * Model API key: `coffee_farm`
 * Block API key: `coffee_farm_coffee`
 *
 * coffee_farm:
 *   title, slug, description, generalinformation, photos, image_url, coffees
 *
 * image_url: Multiple-paragraph text — one image URL per line (optional; merged with photos)
 *
 * coffee_farm_coffee:
 *   name, recipefilter, recipeespresso
 */

type DatoCoffeeFarmCoffeeRaw = {
  name: string | null;
  recipefilter: string | null;
  recipeespresso: string | null;
};

type DatoCoffeeFarmRecordRaw = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  generalinformation: string | null;
  photos: Array<{
    alt: string | null;
    responsiveImage: DatoResponsiveImage | null;
  }>;
  /** One image URL per line (Dato field API key: image_url → GraphQL imageUrl). */
  imageUrl: string | null;
  coffees: DatoCoffeeFarmCoffeeRaw[];
};

const coffeeFarmFields = gql`
  fragment CoffeeFarmFields on CoffeeFarmRecord {
    id
    title
    slug
    description
    generalinformation
    photos {
      alt
      responsiveImage(imgixParams: { fit: crop, w: 800, auto: format }) {
        src
        width
        height
        srcSet
        webpSrcSet
      }
    }
    imageUrl
    coffees {
      ... on CoffeeFarmCoffeeRecord {
        name
        recipefilter
        recipeespresso
      }
    }
  }
`;

function parsePhotoUrls(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];

  // Supports one URL per line, or comma / space separated URLs in image_url
  const matches = value.match(/https?:\/\/[^\s,<>"']+/gi);
  if (!matches?.length) return [];

  return [
    ...new Set(
      matches.map((url) => url.replace(/[.,;)\]]+$/g, "").trim()).filter(Boolean),
    ),
  ];
}

function buildPhotos(raw: DatoCoffeeFarmRecordRaw): CoffeeInfoPhoto[] {
  const photos: CoffeeInfoPhoto[] = [];
  const seen = new Set<string>();

  const add = (src: string, alt: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    photos.push({ src, alt });
  };

  for (const item of raw.photos ?? []) {
    const src = item.responsiveImage?.src;
    if (!src) continue;
    add(src, item.alt?.trim() || raw.title);
  }

  for (const url of parsePhotoUrls(raw.imageUrl)) {
    add(url, raw.title);
  }

  return photos;
}

function buildCoffees(raw: DatoCoffeeFarmRecordRaw): CoffeeInfoCoffee[] {
  return (raw.coffees ?? [])
    .map((coffee) => {
      const name = coffee.name?.trim();
      if (!name) return null;
      return {
        name,
        recipeFilter: coffee.recipefilter?.trim() || "",
        recipeEspresso: coffee.recipeespresso?.trim() || "",
      };
    })
    .filter((coffee): coffee is CoffeeInfoCoffee => Boolean(coffee));
}

function normalizeCoffeeFarm(raw: DatoCoffeeFarmRecordRaw): CoffeeInfoFarm {
  const title = raw.title.trim().endsWith("–")
    ? raw.title.trim()
    : `${raw.title.trim()} –`;

  return {
    slug: raw.slug,
    title,
    description: raw.description?.trim() || "",
    generalInformation: raw.generalinformation?.trim() || "",
    photos: buildPhotos(raw),
    coffees: buildCoffees(raw),
  };
}

function isMissingCoffeeFarmModel(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (
    message.includes("allcoffeefarms") ||
    message.includes("coffeefarm") ||
    message.includes("coffee_farm") ||
    message.includes("undefinedfield")
  ) {
    return true;
  }

  const response = (
    error as {
      response?: {
        errors?: Array<{ extensions?: { code?: string }; message?: string }>;
      };
    }
  ).response;

  return (
    response?.errors?.some(
      (e) =>
        e.extensions?.code === "undefinedField" ||
        e.message?.toLowerCase().includes("coffeefarm") ||
        e.message?.toLowerCase().includes("allcoffeefarms") ||
        e.message?.toLowerCase().includes("coffee_farm"),
    ) ?? false
  );
}

async function fetchAllCoffeeFarmsFromDato(): Promise<CoffeeInfoFarm[]> {
  try {
    const query = gql`
      ${coffeeFarmFields}
      query AllCoffeeFarms {
        allCoffeeFarms(orderBy: title_ASC) {
          ...CoffeeFarmFields
        }
      }
    `;

    const data = await datoRequest<{
      allCoffeeFarms: DatoCoffeeFarmRecordRaw[];
    }>(query);

    return data.allCoffeeFarms.map(normalizeCoffeeFarm);
  } catch (error) {
    if (isMissingCoffeeFarmModel(error)) {
      return [];
    }
    throw error;
  }
}

async function fetchCoffeeFarmBySlugFromDato(
  slug: string,
): Promise<CoffeeInfoFarm | null> {
  try {
    const query = gql`
      ${coffeeFarmFields}
      query CoffeeFarm($slug: String!) {
        coffeeFarm(filter: { slug: { eq: $slug } }) {
          ...CoffeeFarmFields
        }
      }
    `;

    const data = await datoRequest<{
      coffeeFarm: DatoCoffeeFarmRecordRaw | null;
    }>(query, { slug });

    return data.coffeeFarm ? normalizeCoffeeFarm(data.coffeeFarm) : null;
  } catch (error) {
    if (isMissingCoffeeFarmModel(error)) {
      return null;
    }
    throw error;
  }
}

/** Returns DatoCMS farms only. Empty when unset, missing model, or no records. */
export async function getAllCoffeeInfoFarms(): Promise<CoffeeInfoFarm[]> {
  if (!isDatoCmsConfigured()) {
    return [];
  }

  try {
    return await fetchAllCoffeeFarmsFromDato();
  } catch (error) {
    if (isMissingCoffeeFarmModel(error)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("DatoCMS coffee_farm model not found.");
      }
      return [];
    }
    throw error;
  }
}

export async function getCoffeeInfoFarmBySlug(
  slug: string,
): Promise<CoffeeInfoFarm | null> {
  if (!isDatoCmsConfigured()) {
    return null;
  }

  try {
    return await fetchCoffeeFarmBySlugFromDato(slug);
  } catch (error) {
    if (isMissingCoffeeFarmModel(error)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("DatoCMS coffee_farm model not found.");
      }
      return null;
    }
    throw error;
  }
}

export async function getCoffeeInfoFarmSlugs(): Promise<string[]> {
  const farms = await getAllCoffeeInfoFarms();
  return farms.map((farm) => farm.slug);
}
