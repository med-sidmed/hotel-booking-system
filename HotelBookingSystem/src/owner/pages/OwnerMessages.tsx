import MessagesView from '../../components/common/MessagesView';

export default function OwnerMessages() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Questions Clients</h1>
        <p className="text-gray-500 dark:text-gray-400">Répondez aux demandes des clients pour augmenter vos réservations</p>
      </div>
      <MessagesView />
    </div>
  );
}
