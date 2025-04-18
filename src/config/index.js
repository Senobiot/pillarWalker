export const assetsConfig = {
  characters: [
    {
      name: 'minotaur',
      idle: { url: 'chars/minotaur/idle/', amount: 10 },
      run: { url: 'chars/minotaur/run/', amount: 12 },
    },
    {
      name: 'snake',
      idle: { url: 'chars/snake/idle/', amount: 6 },
      run: { url: 'chars/snake/run/', amount: 8 },
    },
  ],
};

export const manifest = {
  bundles: [
    {
      name: 'background',
      assets: [
        {
          alias: 'sky',
          src: '/bg/sky.png',
        },
        {
          alias: 'ground',
          src: '/bg/ground.png',
        },
        {
          alias: 'hill1',
          src: '/bg/hill1.png',
        },
        {
          alias: 'hill2',
          src: '/bg/hill2.png',
        },
        {
          alias: 'trees',
          src: '/bg/trees.png',
        },
        {
          alias: 'clouds',
          src: '/bg/clouds.png',
        },
      ],
    },
    {
      name: 'collectables',
      assets: [
        {
          alias: 'pear',
          src: '/collectables/pear.png',
        },
      ],
    },
    {
      name: 'pillars',
      assets: [
        {
          alias: 'pillar',
          src: '/pillars/pillar.png',
        },
        {
          alias: 'pillar-2',
          src: '/pillars/pillar2.png',
        },
        {
          alias: 'brick',
          src: '/pillars/brick.png',
        },
        {
          alias: 'brick-2',
          src: '/pillars/brick2.png',
        },
      ],
    },
  ],
};
