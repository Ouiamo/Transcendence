
interface profil_iterface{
    gotohome: ()=> void;

}

function Profil({gotohome}: profil_iterface){

    const user = localStorage.getItem('username');
    return(
        
            <div className="bg-red-500 p-4">
              <div className="h-20 w-20 bg-blue-500">
                helooooooooooo
              </div>
              <p>wwwwwwwwwwwwwwwwwwwww{user}</p>
            </div>
          
        // <div className=" bg-red-500 p-2">
        //     <div className="h-20 w-20 bg-green-500">helooooooooooo</div>
        //   {/* <div className="h-20 w-20 bg-red-500 shadow-[0_0_20px_red] rounded-full">hello from tilwinnnd</div> 
        //       <img 
        //             src="https://api.dicebear.com/7.x/avataaars/svg?seed=wafa" />
        //         <p>{user}</p> */}
                
        // </div>
    )
}
export default Profil;