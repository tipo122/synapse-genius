export interface Canvas {
  uid: string;
  user_id: string;
  title: string;
  template_id: string;
  copy_data: {
    strings: [strings: string];
  };
  bg_image_uid: string;
  bg_image_prompt: string;
  item_property: {
    item_name: string;
    item_category: string;
    item_description: string;
  };
  campaign_property: {
    campaign_name: string;
    campaign_description: string;
  };
  collaborators?: [{ user_id: string }];
  canvas_data: {};
  create_dt?: Date;
  update_dt?: Date;
}
