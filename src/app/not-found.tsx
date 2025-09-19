import Image from "next/image";
import Link from "next/link";

function NotFound() {
  return <div className="flex justify-center items-center h-screen flex-col gap-4">
    <Image src="https://http.cat/404" alt="404" width={500} height={500} />
    <div>
      <Link className="btn btn-primary"href="/">Home</Link>
    </div>
  </div>;
}

export default NotFound;