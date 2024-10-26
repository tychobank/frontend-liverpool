import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="navbar bg-[#E10098] flex justify-center">
      <Image
        src={"./liverpool-logo.svg"}
        alt="logo liverpool"
        height={100}
        width={250}
        className="h-1/6 py-3"
      />
    </nav>
  );
};

export default Navbar;
