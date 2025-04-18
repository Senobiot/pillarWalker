declare module '~/config' {
  export const assetsConfig: {
    characters: {
      name: string;
      idle: { url: string; amount: number };
      run: { url: string; amount: number };
    }[];
  };

  export const manifest: {
    bundles: any;
  };
}
