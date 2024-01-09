import Image from "next/image";

function WithoutNameLogo({ width = 32, height = 29 , className = undefined || ""}) {
    return (
        <Image src={"/img/sd.png"} className={className} width={width} height={height} alt="logo" />
    );
}

export default WithoutNameLogo;