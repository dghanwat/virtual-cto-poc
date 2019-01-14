import { AutobotMessageFactory, InbuiltMessageTypes } from './core/autobot-message-factory.service';
import { TextMessageComponent } from './components/message/text-message/text-message.component';
import { EmbedMessageComponent } from './components/message/embed-message/embed-message.component';

export function onAppInit(autobotMessageFactory: AutobotMessageFactory) {
  return () => {
    autobotMessageFactory.registerComponent(InbuiltMessageTypes.TEXT, TextMessageComponent);
    autobotMessageFactory.registerComponent(InbuiltMessageTypes.EMBED, EmbedMessageComponent);
  };
}
