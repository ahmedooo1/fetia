import { DataSource } from 'typeorm';
import { CardTemplate } from './template.entity';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';
import { Rsvp } from '../cards/rsvp.entity';

// Lance ce script avec: npm run seed
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, CardTemplate, Card, Rsvp],
  synchronize: true,
});

const templates = [
  {
    name: 'Aurora',
    category: 'anniversaire',
    designKey: 'aurora-birthday',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Joyeux anniversaire',
      subtitle: 'On célèbre {prenom} !',
      message: "Une nouvelle année pleine de belles surprises t'attend.",
      accent: 'sunset',
      date: 'Samedi 19 septembre, 19h',
      location: "Chez nous, tu connais l'adresse",
      closing: 'Avec tout notre amour',
    },
  },
  {
    name: 'Confetti Pop',
    category: 'fete',
    designKey: 'confetti-pop',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: "C'est la fête !",
      subtitle: 'Rejoins-nous',
      message: 'Une soirée que tu ne vas pas oublier.',
      accent: 'candy',
      date: 'Vendredi 3 juillet, 21h',
      location: 'Le Rooftop, Rouen',
      closing: 'Amène ta bonne humeur',
    },
  },
  {
    name: 'Golden Invite',
    category: 'invitation',
    designKey: 'golden-invite',
    isPremium: false,
    priceCents: 299,
    defaultData: {
      title: 'Vous êtes invités',
      subtitle: '{evenement}',
      message: 'Votre présence sera notre plus beau cadeau.',
      accent: 'gold',
      date: '14 juin 2026',
      location: 'Salle des Fêtes, Elbeuf',
      timeline: [
        { time: '18:00', label: 'Accueil des invités' },
        { time: '19:00', label: 'Discours et toast' },
        { time: '20:00', label: 'Diner' },
        { time: '22:00', label: 'Soirée dansante' },
      ],
      closing: 'On a hâte de vous voir',
    },
  },
  {
    name: 'Botanic',
    category: 'mariage',
    designKey: 'botanic-wedding',
    isPremium: false,
    priceCents: 499,
    defaultData: {
      title: '{prenom1} & {prenom2}',
      subtitle: 'se disent oui',
      message: 'Venez célébrer avec nous ce jour unique.',
      accent: 'sage',
      date: '14 juin 2026',
      location: 'Domaine des Cerisiers, Rouen',
      timeline: [
        { time: '16:00', label: 'Ceremonie civile' },
        { time: '18:00', label: 'Cocktail et photos' },
        { time: '20:00', label: 'Diner et discours' },
        { time: '22:30', label: 'Ouverture du bal' },
      ],
      closing: 'Avec tout notre amour',
    },
  },
  {
    name: 'Petits Nuages',
    category: 'naissance',
    designKey: 'pastel-baby',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Bienvenue {prenom}',
      subtitle: 'Né le {date}',
      message: 'Un petit cœur de plus à aimer.',
      accent: 'sky',
      date: '2 août 2026, 3.2 kg',
      location: 'Maternité de Rouen',
      closing: 'Maman, papa et bébé se portent bien',
    },
  },
  {
    name: 'Neon Nights',
    category: 'fete',
    designKey: 'neon-party',
    isPremium: false,
    priceCents: 399,
    defaultData: {
      title: 'Neon Nights',
      subtitle: 'Dress code : ça brille',
      message: 'DJ set, cocktails et surprises jusqu’au bout de la nuit.',
      accent: 'neon',
      date: 'Samedi 25 juillet, 23h',
      location: 'Warehouse 12, Rouen',
      timeline: [
        { time: '23:00', label: 'Ouverture des portes' },
        { time: '00:00', label: 'DJ set live' },
        { time: '03:00', label: 'After' },
      ],
      closing: 'Viens comme tu es',
    },
  },

  // ---- 15 nouveaux modeles ----
  {
    name: 'Blush Romance',
    category: 'mariage',
    designKey: 'blush-romance',
    isPremium: false,
    priceCents: 499,
    defaultData: {
      title: '{prenom1} & {prenom2}',
      subtitle: 'vous invitent à leur mariage',
      message: 'Un jour, une promesse, et vous à nos côtés.',
      accent: 'blush',
      date: '20 juin 2026',
      location: 'Chateau de Miromesnil',
      timeline: [
        { time: '15h00', label: 'Ceremonie' },
        { time: '17h00', label: 'Cocktail' },
        { time: '20h00', label: 'Diner' },
      ],
      closing: 'Avec amour',
    },
  },
  {
    name: 'Terracotta Boheme',
    category: 'mariage',
    designKey: 'terracotta-boheme',
    isPremium: false,
    priceCents: 499,
    defaultData: {
      title: '{prenom1} & {prenom2}',
      subtitle: 'un mariage sous le soleil',
      message: 'Pampa, terre cuite et amour au programme.',
      accent: 'terracotta',
      date: '11 juillet 2026',
      location: 'Mas des Oliviers, Provence',
      closing: 'On vous attend là-bas',
    },
  },
  {
    name: 'Champagne',
    category: 'mariage',
    designKey: 'champagne-fiancailles',
    isPremium: false,
    priceCents: 399,
    defaultData: {
      title: 'On se fiance !',
      subtitle: '{prenom1} & {prenom2}',
      message: 'Venez lever un verre à notre nouvelle aventure.',
      accent: 'champagne',
      date: 'Samedi 12 septembre, 18h',
      location: 'Rooftop Le Perchoir',
      closing: 'Santé !',
    },
  },
  {
    name: 'Perle',
    category: 'invitation',
    designKey: 'perle-bapteme',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Bapteme de {prenom}',
      subtitle: 'entoure de ses proches',
      message: 'Nous serions honores de vous compter parmi nous.',
      accent: 'pearl',
      date: 'Dimanche 3 mai, 11h',
      location: 'Eglise Saint-Etienne, puis dejeuner',
      closing: 'Merci d etre la pour lui',
    },
  },
  {
    name: 'Nuit Etoilee',
    category: 'invitation',
    designKey: 'nuit-etoilee-gala',
    isPremium: false,
    priceCents: 399,
    defaultData: {
      title: 'Soirée de gala',
      subtitle: '{evenement}',
      message: 'Tenue de soirée exigée. Champagne offert.',
      accent: 'navy',
      date: 'Vendredi 21 novembre, 20h',
      location: 'Hotel de Bourgtheroulde, Rouen',
      timeline: [
        { time: '20h00', label: 'Accueil et vestiaire' },
        { time: '20h30', label: 'Diner de gala' },
        { time: '23h00', label: 'Orchestre et danse' },
      ],
      closing: 'A tres vite',
    },
  },
  {
    name: 'Bordeaux Intime',
    category: 'invitation',
    designKey: 'bordeaux-intime',
    isPremium: false,
    priceCents: 299,
    defaultData: {
      title: 'Diner chez nous',
      subtitle: 'entre amis proches',
      message: 'Une table, du bon vin, et vous.',
      accent: 'burgundy',
      date: 'Samedi 7 fevrier, 20h',
      location: '12 rue des Carmes',
      closing: 'Apportez juste votre sourire',
    },
  },
  {
    name: 'Saint-Valentin',
    category: 'invitation',
    designKey: 'ruby-valentin',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Pour toi',
      subtitle: 'le 14 fevrier et tous les autres jours',
      message: 'Rendez-vous ce soir. Habille-toi bien, le reste est une surprise.',
      accent: 'ruby',
      date: '14 fevrier, 19h30',
      closing: 'Je t aime',
    },
  },
  {
    name: 'Lavande',
    category: 'anniversaire',
    designKey: 'lavande-anniv',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Joyeux anniversaire',
      subtitle: 'a la plus douce',
      message: 'Une année de plus, une raison de plus de te célébrer.',
      accent: 'lavender',
      date: 'Dimanche 26 avril, gouter a 16h',
      location: 'Jardin de la maison',
      closing: 'On t aime fort',
    },
  },
  {
    name: 'Or Noir',
    category: 'anniversaire',
    designKey: 'or-noir-30',
    isPremium: false,
    priceCents: 399,
    defaultData: {
      title: '30 ans, rien que ça',
      subtitle: 'et on va le faire savoir',
      message: 'Dress code noir et or. Pas de cadeau, juste ta présence (et ta playlist).',
      accent: 'noir',
      date: 'Samedi 17 octobre, 20h',
      location: 'Le Loft, Rouen',
      timeline: [
        { time: '20h00', label: 'Cocktails signature' },
        { time: '22h00', label: 'Gâteau et toasts' },
        { time: '23h00', label: 'Dancefloor' },
      ],
      closing: 'RSVP obligatoire, places limitees',
    },
  },
  {
    name: 'Emeraude',
    category: 'fete',
    designKey: 'emeraude-nye',
    isPremium: false,
    priceCents: 399,
    defaultData: {
      title: 'Reveillon 2027',
      subtitle: 'la derniere nuit de l annee',
      message: 'Paillettes, compte a rebours et resolutions oubliees des minuit.',
      accent: 'emerald',
      date: '31 decembre, 21h',
      location: 'Chez Sofia',
      closing: 'Bonne annee en avance',
    },
  },
  {
    name: 'Ocean',
    category: 'naissance',
    designKey: 'ocean-baby',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Ahoy ! {prenom} est la',
      subtitle: 'notre petit matelot',
      message: 'Ne le {date}, deja capitaine de nos coeurs.',
      accent: 'ocean',
      date: '15 mars 2026',
      closing: 'L equipage se porte bien',
    },
  },
  {
    name: 'Menthe Douce',
    category: 'naissance',
    designKey: 'menthe-babyshower',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Baby Shower',
      subtitle: 'pour {prenom}',
      message: 'Jeux, gateaux et pronostics sur le prenom.',
      accent: 'mint',
      date: 'Samedi 9 mai, 15h',
      location: 'Chez Ines',
      closing: 'Fille ou garcon ? Reponse bientot',
    },
  },
  {
    name: 'Rose Poudre',
    category: 'naissance',
    designKey: 'rose-poudre-baby',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Bienvenue {prenom}',
      subtitle: 'notre petit tresor',
      message: 'Nee le {date}, elle a deja tout le monde a ses pieds.',
      accent: 'rose',
      date: '8 avril 2026',
      closing: 'Avec tout notre amour',
    },
  },
  {
    name: 'Foret',
    category: 'fete',
    designKey: 'foret-garden-party',
    isPremium: false,
    priceCents: 0,
    defaultData: {
      title: 'Garden Party',
      subtitle: 'l ete commence chez nous',
      message: 'Barbecue, guirlandes et jeux dans le jardin.',
      accent: 'forest',
      date: 'Samedi 20 juin, midi',
      location: 'Le jardin, comme toujours',
      closing: 'Ramene ta bonne humeur',
    },
  },
  {
    name: 'Minuit',
    category: 'fete',
    designKey: 'minuit-nye',
    isPremium: false,
    priceCents: 299,
    defaultData: {
      title: 'Minuit pile',
      subtitle: 'soirée du Nouvel An',
      message: 'Douze coups, des bulles et la meilleure playlist de la ville.',
      accent: 'midnight',
      date: '31 decembre, 22h',
      location: 'Warehouse 12, Rouen',
      timeline: [
        { time: '22h00', label: 'Ouverture' },
        { time: '23h55', label: 'Compte a rebours' },
        { time: '00h00', label: 'Feu d artifice' },
      ],
      closing: 'On s embrasse a minuit',
    },
  },
];


async function run() {
  const ds = await dataSource.initialize();
  const repo = ds.getRepository(CardTemplate);
  for (const t of templates) {
    const existing = await repo.findOne({ where: { designKey: t.designKey } });
    if (!existing) {
      await repo.save(repo.create(t));
      console.log(`Créé : ${t.name}`);
    } else {
      await repo.save({ ...existing, ...t, id: existing.id });
      console.log(`Mis a jour: ${t.name}`);
    }
  }
  await ds.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
