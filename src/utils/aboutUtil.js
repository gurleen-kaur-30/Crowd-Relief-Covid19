const linkMap = {
    gitlab: 'https://gitlab.com/aossie',
    twitter: 'https://twitter.com/aossie_org',
    gsoc: 'https://groups.google.com/forum/#!forum/aossie-gsoc-2017',
    disaster: 'https://gitlab.com/aossie/CrowdAlert-Mobile',
    footprint: 'https://gitlab.com/aossie/CarbonFootprint',
    agora: 'https://gitlab.com/aossie/Agora',
    mtw: 'https://gitlab.com/aossie/MindTheWord',
    scavenger: 'https://gitlab.com/aossie/Scavenger',
    skymap: 'https://gitlab.com/aossie/starcross'
  },
  projectsData = [
    {
      key: 'disaster',
      title: 'Crowd Alert',
      summary:
        'Application that allows users to post and view incidents around them.',
      lines: 2,
      thumbnail: require('../assets/images/map/disaster.png')
    },
    {
      key: 'footprint',
      title: 'Carbon Footprint',
      summary:
        'Browser extensions and mobile apps to raise environmental awareness.',
      lines: 2,
      thumbnail: require('../assets/images/projects/footprint.png')
    },
    {
      key: 'agora',
      title: 'Agora',
      summary: 'Library of vote counting algorithms for democratic elections.',
      lines: 2,
      thumbnail: require('../assets/images/projects/agora.png')
    },
    {
      key: 'mtw',
      title: 'Mind the Word',
      summary: 'Browser extensions and app to learn new languages.',
      lines: 2,
      thumbnail: require('../assets/images/projects/mtw.png')
    },
    {
      key: 'scavenger',
      title: 'Scavenger',
      summary:
        'Automated theorem prover for predicate logic based on a first-order generalization of conflict-driven clause learning.',
      lines: 3,
      thumbnail: require('../assets/images/projects/scavenger.png')
    },
    {
      key: 'skymap',
      title: 'Stardroid',
      summary: 'The famous Google sky maps!',
      lines: 2,
      thumbnail: require('../assets/images/projects/skymap.png')
    }
  ],
  socialData = [
    {
      key: 'twitter',
      image: require('../assets/images/web-icons/twitter.png')
    },
    {
      key: 'gitlab',
      image: require('../assets/images/web-icons/gitlab.png')
    },
    {
      key: 'gsoc',
      image: require('../assets/images/web-icons/gsoc.png')
    }
  ];

export { linkMap, projectsData, socialData };
