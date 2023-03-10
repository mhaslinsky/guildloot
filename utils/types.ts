export type blizzAPIItem = {
  _links: {
    self: {
      href: string;
    };
  };
  id: number;
  name: string;
  quality: {
    type: string;
    name: string;
  };
  level: number;
  required_level: number;
  media: {
    key: {
      href: string;
    };
    id: number;
  };
  item_class: {
    key: {
      href: string;
    };
    name: string;
    id: number;
  };
  item_subclass: {
    key: {
      href: string;
    };
    name: string;
    id: number;
  };
  inventory_type?: {
    type?: string;
    name?: string;
  };
  purchase_price: number;
  sell_price: number;
  max_count: number;
  is_equippable: boolean;
  is_stackable: boolean;
  preview_item: PreviewItem;
};

export type PreviewItem = {
  item: {
    key: {
      href: string;
    };
    id: number;
  };
  quality: {
    type: string;
    name: string;
  };
  name: string;
  media: {
    key: {
      href: string;
    };
    id: number;
  };
  item_class: {
    key: {
      href: string;
    };
    name: string;
    id: number;
  };
  item_subclass: {
    key: {
      href: string;
    };
    name: string;
    id: number;
  };
  inventory_type: {
    type: string;
    name: string;
  };
  binding: {
    type: string;
    name: string;
  };
  unique_equipped?: string;
  armor?: {
    value: number;
    display: {
      display_string: string;
      color: {
        r: number;
        g: number;
        b: number;
        a: number;
      };
    };
  };
  weapon?: {
    damage: {
      min_value: number;
      max_value: number;
      display_string: string;
      damage_class: {
        type: string;
        name: string;
      };
    };
    attack_speed: {
      value: number;
      display_string: string;
    };
    dps: {
      value: number;
      display_string: string;
    };
    additional_damage: {
      min_value: number;
      max_value: number;
      display_string: string;
      damage_class: {
        type: string;
        name: string;
      };
    }[];
  };
  stats?: {
    type: {
      type: string;
      name: string;
    };
    value: number;
    display: {
      display_string: string;
      color: {
        r: number;
        g: number;
        b: number;
        a: number;
      };
    };
  }[];
  spells?: {
    spell: {
      key: {
        href: string;
      };
      name: string;
      id: number;
    };
    description: string;
  }[];
  sell_price?: {
    value: number;
    display_strings: {
      header: string;
      gold: string;
      silver: string;
      copper: string;
    };
  };
  requirements?: {
    level?:
      | {
          value: number;
          display_string: string;
        }
      | number;
    display_string?: string;
    playable_races?: {
      links: {
        key: {
          href: string;
        };
        name: string;
        id: number;
      }[];
      display_string: string;
    };
    skill?: {
      profession?: {
        name: string;
        id: number;
      };
      level?: string;
      display_string?: string;
    };
  };
  set?: {
    item_set: {
      name: string;
      id: number;
    };
    items: {
      item: {
        key: {
          href: string;
        };
        name: string;
        id: number;
      }[];
      effects?: { display_string: string; required_count: number }[];
      display_string: string;
    };
  };
  is_subclass_hidden?: boolean;
};

export type blizzAPIMedia = {
  _links: {
    self: {
      href: string;
    };
  };
  assets: {
    key: string;
    value: string;
    file_data_id: number;
  }[];
  id: number;
};

export type blizzDBItem = {
  id: number;
  name: string;
  qualityType: string;
  level?: number;
  requiredLevel?: number;
  mediaHref?: string;
  itemClassName?: string;
  itemSubclassName?: string;
  inventoryType?: string;
  inventoryName?: string;
  bindingType?: string;
  bindingName?: string;
  uniqueEquipped?: string;
  previewArmor?: any;
  previewWeapon?: any;
  previewStats?: any;
  previewSpells?: any;
  previewRequirements?: any;
  previewSet?: any;
  thumbnail: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RCLootItem = {
  player: string;
  date?: string;
  time?: string;
  dateTime?: Date;
  id: string;
  itemID: number;
  itemString: string;
  response: string;
  votes: number;
  class: string;
  instance: string;
  boss: string;
  gear1: string;
  gear2: string;
  responseID: string;
  isAwardReason: boolean;
  rollType: string;
  subType: string;
  equipLoc: string;
  note: string;
  owner: string;
  itemName: string;
  bLootDBItem?: blizzDBItem;
  guild: string;
};

export type LootRow = {
  player: string;
  itemName: string;
  boss: string;
  instance: string;
  response: string;
  dateTime: Date;
};

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  user: User;
};

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  lastSignedIn: Date | null;
  accounts: Account[];
  sessions: Session[];
  guildAdmin: Guild[];
  guildOfficer: Guild[];
  guildMember: Guild[];
};

export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
};

export type Guild = {
  id: string;
  name: string;
  image: string;
  Admin: User;
  adminId: string;
  officers: User[];
  members: User[];
  rcLootItems: RCLootItem[];
};
