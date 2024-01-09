import PrimaryLogo from "@/components/common/Logo/PrimaryLogo";
import WithoutNameLogo from "@/components/common/Logo/WithoutNameLogo";
import { Search } from "@mui/icons-material";
import { Input } from "@mui/joy";
import Menus from "./menus";

interface SidbarProps {
    openSideBar: boolean;
}

const Sidbar: React.FC<SidbarProps> = ({ openSideBar }) => {
    return (
        <aside className="p-5">
            <div className="w-full flex justify-center items-center">
                <PrimaryLogo className="PrimaryLogo" />
                <WithoutNameLogo className="WithoutNameLogo" />
            </div>
            <div className="searchbox w-full flex justify-center items-center mt-6">
                <Input disabled={false} placeholder="جستجو در منو..." className="border-c" fullWidth startDecorator={<Search />} />
            </div>
            <div className="w-full flex justify-center items-center mt-6">
                <Menus openSideBar={openSideBar} />
            </div>
        </aside>
    );
}

export default Sidbar;