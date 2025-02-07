// 'use client';

// import Footer from '@/components/homepage/Footer';
// import { useState, useEffect } from 'react';

// interface Talent {
//     id: number;
//     full_name: string;
//     email: string;
//     bio: string | null;
//     profile_picture: string | null;
//     resume_file: string;
//     is_featured: boolean;
//     createdAt: string;
//     updatedAt: string;
//     job_title: { title: string } | null;
//     skills: { id: number; name: string; category: string }[];
// }

// interface Category {
//     id: number;
//     name: string;
// }

// export default function TalentsPage() {
//     const [talents, setTalents] = useState<Talent[]>([]);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState<string>('');
//     const [page, setPage] = useState(1);
//     const talentsPerPage = 9;

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const [talentsRes, catRes] = await Promise.all([
//                     fetch('http://localhost:5000/api/talents'),
//                     fetch('http://localhost:5000/api/talents/categories'),
//                 ]);
//                 if (!talentsRes.ok || !catRes.ok) {
//                     throw new Error('Error fetching data');
//                 }
//                 const talentsData: Talent[] = await talentsRes.json();
//                 const catData: Category[] = await catRes.json();
//                 setTalents(talentsData);
//                 setCategories(catData);
//                 setFilteredCategories(catData);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchData();
//     }, []);

//     const filteredTalents = talents.filter((talent) => {
//         const matchesSearch = talent.full_name.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesCategory = selectedCategory ? 
//             talent.skills.some(skill => skill.category === selectedCategory) 
//             : true;
//         return matchesSearch && matchesCategory;
//     });

//     const paginatedTalents = filteredTalents.slice((page - 1) * talentsPerPage, page * talentsPerPage);
//     const totalPages = Math.ceil(filteredTalents.length / talentsPerPage);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 Cargando talentos...
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-forms flex flex-col">
//             {/* Logo */}
//             <div className="text-center mb-4">
//                 <img src="/img/LOGO-01.png" alt="Talentia Logo" className="w-64 h-auto inline-block" />
//             </div>

//             {/* Search & Category Filters */}
//             <div className="px-4 flex flex-col items-center">
//                 <input
//                     type="text"
//                     placeholder="Buscar talentos..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full max-w-md p-3 border border-gray-300 rounded text-black mb-4"
//                 />
//                 <div className="flex flex-wrap gap-2 justify-center">
//                     <button
//                         onClick={() => setSelectedCategory('')}
//                         className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-[#244c56] text-white' : 'bg-gray-300 text-gray-700'}`}
//                     >
//                         Todas
//                     </button>
//                     {filteredCategories.map((cat) => (
//                         <button
//                             key={cat.id}
//                             onClick={() => setSelectedCategory(cat.name)}
//                             className={`px-4 py-2 rounded ${selectedCategory === cat.name ? 'bg-[#244c56] text-white' : 'bg-gray-300 text-gray-700'}`}
//                         >
//                             {cat.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Talents Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//                 {paginatedTalents.map((talent) => (
//                     <div key={talent.id} className="bg-white shadow rounded p-4 text-center">
//                         <img
//                             src={talent.profile_picture || '/img/default-profile.png'}
//                             alt={talent.full_name}
//                             className="w-24 h-24 mx-auto rounded-full mb-3"
//                         />
//                         <h3 className="text-lg font-semibold">{talent.full_name}</h3>
//                         <p className="text-gray-600">{talent.job_title?.title || 'Sin título'}</p>
//                         <a href={talent.resume_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                             Ver CV
//                         </a>
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-center my-6">
//                 <button
//                     onClick={() => setPage(page - 1)}
//                     disabled={page === 1}
//                     className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                     Anterior
//                 </button>
//                 <span className="px-4 py-2 bg-gray-200 rounded">{page} / {totalPages}</span>
//                 <button
//                     onClick={() => setPage(page + 1)}
//                     disabled={page === totalPages}
//                     className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                     Siguiente
//                 </button>
//             </div>

//             <Footer />
//         </div>
//     );
// }
