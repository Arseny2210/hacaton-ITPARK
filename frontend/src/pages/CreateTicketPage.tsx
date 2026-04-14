import { CreateTicketForm } from '../components/CreateTicketForm';

export function CreateTicketPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Создать заявку</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CreateTicketForm />
      </div>
    </div>
  );
}