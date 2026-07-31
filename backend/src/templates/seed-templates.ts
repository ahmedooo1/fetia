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
      subtitle: 'Nait le {date}',
      message: 'Un petit coeur de plus a aimer.',
      accent: 'sky',
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
    },
  },
];

async function run() {
  const ds = await dataSource.initialize();
  const repo = ds.getRepository(CardTemplate);
  for (const t of templates) {
    const exists = await repo.findOne({ where: { designKey: t.designKey } });
    if (!exists) {
      await repo.save(repo.create(t));
      console.log(`Cree: ${t.name}`);
    } else {
      console.log(`Deja present: ${t.name}`);
    }
  }
  await ds.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
