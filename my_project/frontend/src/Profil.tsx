
interface profil_iterface{
    gotohome: ()=> void;

}

function Profil({gotohome}: profil_iterface){

    const user = localStorage.getItem('username');
    return(
        <div className="bg-red-500">
          {/* <div className="h-20 w-20 bg-red-500 shadow-[0_0_20px_red] rounded-full">hello from tilwinnnd</div>  */}
              <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=wafa" />
                <p>{user}</p>
                
        </div>
    )
}
export default Profil;