/*
export function getUser(): Player {
    return {
      "primaryColor": "#4d0d5b",                      // ---
      "image": {                                      // ---
        "url": "https://i.imgur.com/Sk3qCsJ.png",
        "xDesloc": 0,
        "yDesloc": 0,
        "scale": 1
      },
      "name": "Azazel",                               // ---
      "nickname": "O Falso Sombrio",                  // ---
      "identity": {                                   // ---
        "Física": "Um Treva alto e com longos cabelos… Em sua Maquiagem de Medo, é repleto de tatuagens."
      },
      "sumary": {                                     // ---
        "Objetivo": "Matar Tamid Emet, o Deus Morto.",
        "Passado": "Seu tempo como drogado de Erva de Sangue. Até o dia que acidentalmente cheirou sua Flor Divina…"
      },
      "capacities": {                                // ---
        "basics": {
          "strength": "A",
          "agility": "A+",
          "body": "A-",
          "mind": "B+",
          "senses": "B",
          "charisma": "FF",
        },
        "peculiars": {                                // ---
          "Seirath": "A-",
          "Atirador": "B+",
          "Amante de Freira": "C",
          "Lanceiro": "FF"
        },
        "specials": {                                     // ---
          "ambition": "F+",
          "judge": "F",
          "wish": "S",
          "will": "SS"
        },
        "primal": {                                  // ---
          "kind": "Hope",
          "value": 2
        }
      },
      "stats": [                                     // ---
        {
          'kind': 'VIT',
          'relativeCapacity':'mind',
          'naturalMod': '+++',
          'actual': 100
        },
        {
          'kind': 'VIT',
          'relativeCapacity':'body',
          'naturalMod': '',
          'actual': 100
        },
        {
          'kind': 'DMG',
          'relativeCapacity':'strength',
          'naturalMod': '+'
        },
        {
          'kind': 'DMG',
          'relativeCapacity':'charisma',
          'naturalMod': ''
        },
      ],
      "toShowStats": {
        'DMG': ['agility', 'charisma'],
        'VIT': ['body', 'mind'],
        'DEF': ['agility'],
        'ATK': ['Amante de Freira']
      },
      "moviments": [                                 // ---
        {
          'kind': 'Peculiar',
          'relativeCapacity': 'Seirath',
          'agregated': '',
          'name': 'Dar o bote',
          'description': 'Atacar com tudo, sem pensar em defesa.',
        },{
          'kind': 'Peculiar',
          'relativeCapacity': 'Seirath',
          'agregated': '',
          'name': 'Dar o vasdrqwe',
          'description': 'Imagem: “Um Louva-deus saltando com suas quatro patas”\nAo usar uma rajada de ventos sobre seus pés para se movimentar rapidamente, jogue IMPULSO ESTALAR:\n\t(2👑) Você avança em graça! Escolha um valor entre 1 e 2*~VONTADE~ metros como Movimentação Instantânea. E além disso, você avançou em Celeridade, o que lhe concede + em DEF pelos próximos 3 segundos.\n\t(1👑) Você avança! (2👑) sem Celeridade\n\t(0👑) Você tropica! Algo desastroso ocorreu, seja uma colisão, ou ir na direção errada. Se prepare para o pior! O Mestre faz um Movimento.',
        },
        {
          'kind': 'Peculiar',
          'relativeCapacity': 'Seirath',
          'agregated': '',
          'name': 'Dar oasd vasdrqwe',
          'description': 'Imagem: “Um Louva-deus saltando com suas quatro patas”\nAo usar uma rajada de ventos sobre seus pés para se movimentar rapidamente, jogue IMPULSO ESTALAR:\n\t(2👑) Você avança em graça! Escolha um valor entre 1 e 2*~VONTADE~ metros como Movimentação Instantânea. E além disso, você avançou em Celeridade, o que lhe concede + em DEF pelos próximos 3 segundos.\n\t(1👑) Você avança! (2👑) sem Celeridade\n\t(0👑) Você tropica! Algo desastroso ocorreu, seja uma colisão, ou ir na direção errada. Se prepare para o pior! O Mestre faz um Movimento.',
        },
        {
          'kind': 'Peculiar',
          'relativeCapacity': 'Atirador',
          'agregated': '+',
          'name': 'Atirar com cuidado',
          'description': 'Atacar com cuidado, kkkkk',
        }
      ],
      "things": [
        {
          'name': 'Arma pobre',
          'description': 'Muito ruim, mds!',
          'relativeCapacity': 'Atirador',
          'gliph': 'FF-',
        },
        {
          'name': 'Coco',
          'description': 'Tiro doku'
        }
      ],
      "minucies": [                                 // ---
        {
          name: 'O Vaper Imparável',
          extraName: 'Maldição',
          description: 'Não consegue baforar pouco... Tem que sugar muito forte o cano do narguile!'
        },
        {
          name: 'Sexo Natural',
          extraName: 'Treino',
          description: '+50% de Evolução Física ao Sexo'
        },
      ],
      "evolutions": {                                // ---
        "physical": 0,
        "espiritual": 0
      },
      "extensions": [                                // ---
        {
          name: 'Deuses Mortos',
          kind: 'Procurado',
          progress: 2,
          value: 'A',
        },
        {
          name: 'Melissa',
          kind: 'Amizade',
          progress: 50,
          value: '',
        }
      ],
      "anotations":                                    // ---
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ex velit, hendrerit sed est sed, ornare maximus risus. Integer vel enim dui. Duis non purus ut arcu iaculis faucibus. Ut pretium urna finibus tortor dapibus, ac feugiat mi ornare. Donec tellus lectus, aliquet eget sodales nec, congue vitae mi. Nulla congue orci vel neque pulvinar, in pellentesque neque sagittis. In vulputate ligula vitae quam convallis tempor. Proin hendrerit vitae urna et pulvinar. Ut metus tellus, aliquam id facilisis in, ultrices id libero. \n Aenean ut mi aliquam, tristique felis quis, convallis nisl. Sed consectetur, orci nec luctus pellentesque, turpis ligula dignissim lorem, eu luctus ligula libero sed tellus. Morbi ut maximus tortor, non pellentesque libero. Aenean mollis nibh vitae ex porta mollis. Nullam commodo tellus mollis ligula sollicitudin dapibus. Cras erat diam, auctor eget massa eget, convallis iaculis velit. Mauris rutrum vestibulum interdum. Phasellus ut magna dui. Suspendisse lectus nibh, euismod ac porta a, ullamcorper ut mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    }
  }
*/
