export type CoffeeInfoPhoto = {
  /** Thumbnail / strip preview */
  src: string;
  /** Larger image for lightbox (falls back to src) */
  fullSrc: string;
  alt: string;
};

export type CoffeeInfoVideo = {
  url: string;
  title: string;
  provider: string;
  providerUid: string;
  thumbnailUrl: string | null;
};

export type CoffeeInfoCoffee = {
  name: string;
  recipeFilter: string;
  recipeEspresso: string;
};

export type CoffeeInfoFarm = {
  slug: string;
  /** Display title, e.g. "VOLCAN AZUL" */
  title: string;
  description: string;
  /** Free-form text for General Information accordion. */
  generalInformation: string;
  photos: CoffeeInfoPhoto[];
  /** DatoCMS External Video (`video_url`), typically YouTube. */
  video: CoffeeInfoVideo | null;
  coffees: CoffeeInfoCoffee[];
};

export const coffeeInfoPageIntro =
  "Brewing guides, farm information, and recipes for the coffees we currently work with.";

/** FAQ-style intro block shown above the farm list (same pattern as Get in Contact). */
export const coffeeInfoBrewingSection = {
  title: "BREWING APRIL",
  description:
    "Focuses on any coffee-related questions. If you can't find the information you need, feel free to reach out using the form below",
  items: [
    {
      question: "How should I brew my coffee?",
      answer:
        "You will find the recipes and informations for each of our coffees [here](#farms).\n\nPlease note those recipes are based on what we serve in our Store, they might need time to be updated after the release of a new coffee. As we understand that our Store's setup is professional, you are welcome to use these recipes as a guide, and tune your equipment to achieve your perfect cup.\n\nWe are not able to give tailored recipes based on your equipment.",
    },
    {
      question: "Special recipes - particle size, water composition etc.",
      answer:
        "- We use a reverse osmosis system, with a PPM usually between 25 and 50. We do not measure the exact composition of our water so we are not able to share that with you.\n\n- We are aware that not everyone has the same set up and our recipes might not be fully relevant to everyone. Unfortunately we are not able to offer solutions tailored to everyone's set up, as we might not use the same equipment as you are. Nonetheless, we trust that you are able to find your perfect recipe and get the most out of each cup.\n\n- We do not measure the particle size in our recipes, so we are not able to share these.",
    },
    {
      question: "Resting your coffee",
      answer:
        "We recommend you let your beans rest for **at least 14 days** before brewing, this is what we use in our store and roastery, and we find that this way it offers a way better flavor clarity and balance in the cup.\n\nFor more details, check out our [Youtube channel](https://www.youtube.com/channel/UCPlsOYZ8ZEam57EUCf3DKjg), where we talk about brewing techniques and the coffees of our lineup.",
    },
  ],
} as const;
