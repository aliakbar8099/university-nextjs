import Image from "next/image";

function PrimaryLogo({ width = 240, height = 80, className = undefined || "" }) {
    return (
        <Image src={"/img/Screenshot 2024-01-04 172023.png"} className={className} width={width} height={height} alt="logo name" />
    );
}

export default PrimaryLogo;