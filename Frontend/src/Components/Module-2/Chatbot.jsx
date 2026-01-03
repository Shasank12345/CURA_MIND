import { useEffect, useRef, useState } from "react";
import { Send, Plus, Bot, Download, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";

export default function App() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "Health Assistant",
      messages: [],
      triageAnswers: [],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState("");

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  const triageQuestions = [
    "Able to bear weight on ankle?",
    "Pain when pressing ankle bones?",
    "Visible ankle swelling?",
    "Injury caused by twisting/rolling?",
    "Pain mainly in ankle area?",
  ];

  const activeChat = chats.find((c) => c.id === activeChatId);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, activeChat?.triageAnswers]);

  const summarizeTitle = (text) =>
    text.replace(/[^\w\s]/gi, "").split(" ").slice(0, 5).join(" ");

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title:
                chat.title === "Health Assistant" ||
                chat.title === "New Consultation"
                  ? summarizeTitle(input)
                  : chat.title,
              messages: [
                ...chat.messages,
                { sender: "user", text: input },
                { sender: "bot", text: "Thank you. Processing..." },
              ],
            }
          : chat
      )
    );
    setInput("");
  };

  const answerTriage = (answer) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              triageAnswers: [...chat.triageAnswers, answer],
              messages: [
                ...chat.messages,
                {
                  sender: "bot",
                  text: `Q: ${
                    triageQuestions[chat.triageAnswers.length]
                  }`,
                },
                { sender: "user", text: `A: ${answer}` },
              ],
            }
          : chat
      )
    );
  };

  const newChat = () => {
    const id = Date.now();
    setChats((prev) => [
      {
        id,
        title: "New Consultation",
        messages: [],
        triageAnswers: [],
      },
      ...prev,
    ]);
    setActiveChatId(id);
    setInput("");
  };

  const deleteChat = (id) => {
    const remaining = chats.filter((chat) => chat.id !== id);
    setChats(remaining);
    if (id === activeChatId) {
      setActiveChatId(remaining.length ? remaining[0].id : null);
    }
  };

  const downloadChat = () => {
    if (!activeChat) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const date = new Date().toLocaleString();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CuraMind Health Consultation Report", 40, 40);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Chat Title: ${activeChat.title}`, 40, 70);
    doc.text(`Date: ${date}`, 40, 90);

    let y = 120;

    if (activeChat.triageAnswers.length > 0) {
      doc.setFont("Helvetica", "bold");
      doc.text("ANKLE TRIAGE SUMMARY", 40, y);
      y += 25;

      doc.setFont("Helvetica", "normal");
      activeChat.triageAnswers.forEach((ans, idx) => {
        doc.text(
          `${idx + 1}. ${triageQuestions[idx]} : ${ans}`,
          40,
          y
        );
        y += 20;
      });
      y += 20;
    }

    doc.setFont("Helvetica", "bold");
    doc.text("Chat Transcript", 40, y);
    y += 20;

    doc.setFont("Helvetica", "normal");
    activeChat.messages.forEach((msg) => {
      if (y > 780) {
        doc.addPage();
        y = 40;
      }
      doc.text(`${msg.sender.toUpperCase()}: ${msg.text}`, 40, y);
      y += 18;
    });

    doc.save(`${activeChat.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4 font-bold text-2xl">CuraMind 🩺</div>

        <div className="px-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full px-3 py-2 rounded-lg bg-white/10 text-sm"
          />
        </div>

        <button
          onClick={newChat}
          className="m-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600"
        >
          <Plus size={16} /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                chat.id === activeChatId
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => setActiveChatId(chat.id)}
                className="flex-1 text-left truncate"
              >
                {chat.title}
              </button>

              <button
                onClick={() => deleteChat(chat.id)}
                className="ml-2 text-white/70 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow flex flex-col">
          <div className="h-16 px-6 flex justify-between items-center border-b bg-blue-50">
            <div className="flex items-center gap-3">
              <Bot size={18} />
              <p className="font-semibold">CuraMind Assistant</p>
            </div>
            <button
              onClick={downloadChat}
              className="text-xs border px-3 py-1 rounded-lg"
            >
              <Download size={14} /> PDF
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-gray-800">
                How can I support your health today?
              </h1>
              <p className="text-gray-500 max-w-xl mx-auto">
                Describe your symptoms or answer the ankle triage questions below.
              </p>
            </div>

            {activeChat &&
              activeChat.triageAnswers.length <
                triageQuestions.length && (
                <div className="bg-gray-100 rounded-xl p-4 max-w-xl mx-auto">
                  <p className="text-sm">
                    {
                      triageQuestions[
                        activeChat.triageAnswers.length
                      ]
                    }
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => answerTriage("Yes")}
                      className="flex-1 py-2 rounded-lg bg-green-500 text-white"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => answerTriage("No")}
                      className="flex-1 py-2 rounded-lg bg-red-500 text-white"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

            {activeChat?.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm max-w-xl ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          <div className="border-t px-6 py-4">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 border rounded-xl px-4 py-3 text-sm"
                placeholder="Type your health concern..."
              />
              <button
                onClick={sendMessage}
                className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
 