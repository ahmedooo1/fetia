import { DataSource } from 'typeorm';
import { CardTemplate } from './template.entity';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';

// Lance ce script avec: npm run seed
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, CardTemplate, Card],
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
      subtitle: 'On celebre {prenom} !',
      message: "Une nouvelle annee pleine de belles surprises t'attend.",
      accent: 'sunset',
      date: 'Samedi 19 septembre, 19h',
      location: 'Chez nous, tu connais l adresse',
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
      title: "C'est la fete !",
      subtitle: 'Rejoins-nous',
      message: 'Une soiree que tu ne vas pas oublier.',
      accent: 'candy',
      date: 'Vendredi 3 juillet, 21h',
      location: 'Le Rooftop, Rouen',
      closing: 'Amene ta bonne humeur',
    },
  },
  {
    name: 'Golden Invite',
    category: 'invitation',
    designKey: 'golden-invite',
    isPremium: true,
    priceCents: 299,
    defaultData: {
      title: 'Vous etes invites',
      subtitle: '{evenement}',
      message: 'Votre presence sera notre plus beau cadeau.',
      accent: 'gold',
      date: '14 juin 2026',
      location: 'Salle des Fetes, Elbeuf',
      timeline: [
        { time: '18:00', label: 'Accueil des invites' },
        { time: '19:00', label: 'Discours et toast' },
        { time: '20:00', label: 'Diner' },
        { time: '22:00', label: 'Soiree dansante' },
      ],
      closing: 'On a hate de vous voir',
    },
  },
  {
    name: 'Botanic',
    category: 'mariage',
    designKey: 'botanic-wedding',
    isPremium: true,
    priceCents: 499,
    defaultData: {
      title: '{prenom1} & {prenom2}',
      subtitle: 'se disent oui',
      message: 'Venez celebrer avec nous ce jour unique.',
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
      subtitle: 'Ne le {date}',
      message: 'Un petit coeur de plus a aimer.',
      accent: 'sky',
      date: '2 aout 2026, 3.2 kg',
      location: 'Maternite de Rouen',
      closing: 'Maman, papa et bebe se portent bien',
    },
  },
  {
    name: 'Neon Nights',
    category: 'fete',
    designKey: 'neon-party',
    isPremium: true,
    priceCents: 399,
    defaultData: {
      title: 'Neon Nights',
      subtitle: 'Dress code: ca brille',
      message: 'DJ set, cocktails et surprises jusqu au bout de la nuit.',
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
];

async function run() {
  const ds = await dataSource.initialize();
  const repo = ds.getRepository(CardTemplate);
  for (const t of templates) {
    const existing = await repo.findOne({ where: { designKey: t.designKey } });
    if (!existing) {
      await repo.save(repo.create(t));
      console.log(`Cree: ${t.name}`);
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
