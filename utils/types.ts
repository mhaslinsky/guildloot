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
  inventory_type: {
    type: string;
    name: string;
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
  unique_equipped: string;
  weapon: {
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
  sell_price: {
    value: number;
    display_strings: {
      header: string;
      gold: string;
      silver: string;
      copper: string;
    };
  };
  requirements: {
    level: {
      value: number;
      display_string: string;
    };
  };
  is_subclass_hidden: boolean;
  reward_data: {
    reward_title: {
      type: string;
      name: string;
      quantity: number;
      title: {
        type: string;
        id: number;
        name: string;
      };
    };
  };
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
