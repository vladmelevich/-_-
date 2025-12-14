import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Award, TrendingUp, TrendingDown, Plus, Minus, Search } from 'lucide-react';

const TeacherPanelPage = () => {
  const { user } = useAuth();
  const { getStudents, updateUserCredits } = useUsers();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCredits, setEditingCredits] = useState({});

  useEffect(() => {
    // Проверка прав доступа
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    // Загрузка списка студентов
    const loadStudents = () => {
      const allStudents = getStudents();
      setStudents(allStudents);
    };

    loadStudents();
    
    // Обновляем список каждую секунду для синхронизации
    const interval = setInterval(loadStudents, 1000);
    return () => clearInterval(interval);
  }, [user, navigate, getStudents]);

  const handleCreditsChange = (userId, amount) => {
    if (updateUserCredits(userId, amount)) {
      // Обновляем локальное состояние для мгновенной обратной связи
      const updatedStudents = students.map(s => 
        s.id === userId 
          ? { ...s, credits: Math.max(0, (s.credits || 0) + amount) }
          : s
      );
      setStudents(updatedStudents);
      
      // Обновляем состояние редактирования для визуальной обратной связи
      setEditingCredits(prev => ({
        ...prev,
        [userId]: (prev[userId] || 0) + amount
      }));
      
      setTimeout(() => {
        setEditingCredits(prev => {
          const newState = { ...prev };
          delete newState[userId];
          return newState;
        });
      }, 1000);
    }
  };

  const filteredStudents = students.filter(student =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCredits = students.reduce((sum, s) => sum + (s.credits || 0), 0);
  const totalWins = students.reduce((sum, s) => sum + (s.wins || 0), 0);
  const totalLosses = students.reduce((sum, s) => sum + (s.losses || 0), 0);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Преподавательская</h1>
            <p className="text-gray-400 text-sm">Управление студентами и зачетами</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase font-bold">Всего студентов</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{students.length}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase font-bold">Всего зачетов</p>
            <Award className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">{totalCredits}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase font-bold">Побед</p>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{totalWins}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase font-bold">Поражений</p>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{totalLosses}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени или ID..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Список студентов</h2>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Студент</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">ID</th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase">Зачеты</th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase">Победы</th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase">Поражения</th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    {searchQuery ? 'Студенты не найдены' : 'Нет зарегистрированных студентов'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.username}
                          className="w-10 h-10 rounded-lg bg-gray-800"
                        />
                        <div>
                          <p className="text-white font-semibold">{student.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <p className="text-gray-400 text-sm font-mono">{student.id}</p>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-lg font-bold ${
                          editingCredits[student.id] 
                            ? editingCredits[student.id] > 0 
                              ? 'text-accent' 
                              : 'text-red-400'
                            : 'text-white'
                        }`}>
                          {student.credits || 0}
                        </span>
                        {editingCredits[student.id] && (
                          <span className={`text-xs font-bold ${
                            editingCredits[student.id] > 0 ? 'text-accent' : 'text-red-400'
                          }`}>
                            {editingCredits[student.id] > 0 ? '+' : ''}{editingCredits[student.id]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span className="text-green-400 font-semibold">{student.wins || 0}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span className="text-red-400 font-semibold">{student.losses || 0}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleCreditsChange(student.id, 1)}
                          className="p-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
                          title="Добавить зачет"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCreditsChange(student.id, -1)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Убрать зачет"
                          disabled={(student.credits || 0) <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredStudents.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              {searchQuery ? 'Студенты не найдены' : 'Нет зарегистрированных студентов'}
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={student.avatar}
                    alt={student.username}
                    className="w-12 h-12 rounded-lg bg-gray-800"
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{student.username}</p>
                    <p className="text-gray-400 text-xs font-mono">{student.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Зачеты</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className={`text-lg font-bold ${
                        editingCredits[student.id] 
                          ? editingCredits[student.id] > 0 
                            ? 'text-accent' 
                            : 'text-red-400'
                          : 'text-white'
                      }`}>
                        {student.credits || 0}
                      </span>
                      {editingCredits[student.id] && (
                        <span className={`text-xs font-bold ${
                          editingCredits[student.id] > 0 ? 'text-accent' : 'text-red-400'
                        }`}>
                          {editingCredits[student.id] > 0 ? '+' : ''}{editingCredits[student.id]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Победы</p>
                    <span className="text-green-400 font-semibold">{student.wins || 0}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Поражения</p>
                    <span className="text-red-400 font-semibold">{student.losses || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCreditsChange(student.id, 1)}
                    className="flex-1 p-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-semibold">Добавить</span>
                  </button>
                  <button
                    onClick={() => handleCreditsChange(student.id, -1)}
                    className="flex-1 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={(student.credits || 0) <= 0}
                  >
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-semibold">Убрать</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPanelPage;

