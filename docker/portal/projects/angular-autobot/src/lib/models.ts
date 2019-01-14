export interface Message {
  id: string;
  type: string;
  human: boolean;
  visible?: boolean;
  loading: boolean;
  content: any;
  created_date: Date;
  freeze?: boolean;
  freezeUntilLoad?: boolean;
  showFeedBackIcons?:boolean
}

export interface Action {
  type: string;
  actionData?: any;
  autobotOpts?: any;
  created_date: Date;
}
