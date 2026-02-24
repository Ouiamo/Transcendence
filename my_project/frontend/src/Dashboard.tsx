import { Sidebar } from './Sidebar';
import { Grid } from './Grid';

interface Dashboardtest {
    user: any;
    gotohome: () => void;
    gotoprofil: () => void;
    delete_obj: (data: any) => void;
    listfriends: () => void;
    goto: () => void;
    gotodashbord: () => void;
    gotoia: () => void;
    gotofriends: () => void;
    gotosetting: () => void;
    gotoleaderboard: () => void;
    setActiveSafe: (s: any) => void;
}

function Dashboard({ gotohome, gotoprofil, user, delete_obj, listfriends, goto, gotodashbord, gotoia, gotofriends, gotosetting, gotoleaderboard, setActiveSafe }: Dashboardtest) {
    return (
        <div className="flex h-screen w-full bg-[#0b0618] text-white overflow-hidden">
            <div className="flex h-full w-full relative">
                <Sidebar
                    user_={user} gotohome={gotohome} delete_obj={delete_obj}
                    gotodashbord={gotodashbord} gotoprofil={gotoprofil}
                    gotofriends={gotofriends} gotosetting={gotosetting}
                    gotoleaderboard={gotoleaderboard} gotolocalgame={goto}
                    setActiveSafe={setActiveSafe}
                />
                <div className="flex w-full h-full  bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221]">

                    <div className="flex-1 h-screen overflow-y-auto  ml-[88px] md:p-10">
                        <Grid listfriends={listfriends} goto={goto} goto_ia={gotoia} setActiveSafe={setActiveSafe} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
