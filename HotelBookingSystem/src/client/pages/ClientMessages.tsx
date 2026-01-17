import MessagesView from '../../components/common/MessagesView';

export default function ClientMessages() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Messagerie</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez vos conversations avec les établissements</p>
      </div>
      <MessagesView />
    </div>
  );
}
