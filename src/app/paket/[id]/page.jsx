// import { createClient } from "@/utils/supabase/server";
// import NavbarHome from "@/app/ComponenUser/NavbarHome";
// import Paketlaundridua from "../../ComponenUser/CardPaketDua";

// export default async function ItemById({params}) {
//     const supabase = await createClient()
//     const { data, error : authError} = await supabase.auth.getUser();
//     console.log(data);

//     if (authError || !data?.user) {
//         redirect('/login');
//     }

//     const  {id}  = params;
//     const { data: paketLaundri, error } = await supabase.from("paketLaundri").select().eq("id", id);
//     console.log(paketLaundri);
//     console.log(id);

//     if (error) {
//         console.log(error.message);
//     }

//     return (
//         <div>
//             <NavbarHome/>
//         <div className="w-3/4 p-4 flex flex-warp gap-4">
//                 {paketLaundri && paketLaundri.map((pkt, idx) => (
//                   <Paketlaundridua
//                     key={idx}
//                     nama={pkt.nama}
//                     deskripsi={pkt.deskripsi}
//                     harga={pkt.harga}
//                     gambar={pkt.gambar}
//                     id = {pkt.id}
//                   />
//                 ))}
//             </div>
//         </div>
//     )
// }