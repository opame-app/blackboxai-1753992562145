import React from 'react';
import { MessageSquare, Edit } from 'lucide-react';

// Datos de ejemplo
const conversations = [
  { id: 1, name: 'Gordon Ramsay', lastMessage: '¡Idiota! ¿Dónde está la salsa de cordero?', time: '1h', avatar: 'https://i.pravatar.cc/150?u=gordon', unread: 2 },
  { id: 2, name: 'Jamie Oliver', lastMessage: 'Lovely jubbly! ¿Probaste con un poco de aceite de oliva?', time: '3h', avatar: 'https://i.pravatar.cc/150?u=jamie', unread: 0 },
  { id: 3, name: 'Nigella Lawson', lastMessage: 'Es simplemente delicioso, una sinfonía en tu boca.', time: 'ayer', avatar: 'https://i.pravatar.cc/150?u=nigella', unread: 0 },
  { id: 4, name: 'Anthony Bourdain', lastMessage: 'El contexto y la historia son la mitad del sabor.', time: '2d', avatar: 'https://i.pravatar.cc/150?u=anthony', unread: 1 },
];

const Messages = () => {
  return (
    <div className="flex h-screen bg-white border-t sm:border-t-0">
      {/* Lista de Chats */}
      <div className="w-full md:w-[397px] border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Mensajes</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Edit className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto">
          {conversations.map(chat => (
            <div key={chat.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
              <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full mr-4" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{chat.name}</h2>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className={`text-sm ${chat.unread > 0 ? 'text-black font-semibold' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Área de Mensaje Activo (Placeholder) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center">
        <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-12 h-12" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-light">Tus mensajes</h2>
        <p className="text-gray-500">Envía fotos y mensajes privados a un amigo o grupo.</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">
          Enviar mensaje
        </button>
      </div>
    </div>
  );
};

export default Messages;
