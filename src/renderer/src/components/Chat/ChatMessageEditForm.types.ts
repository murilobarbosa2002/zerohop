export interface ChatMessageEditFormProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}
