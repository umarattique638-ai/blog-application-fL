import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";

function SearchBar() {
  return (
    <>
      <form action="" className="hover:cursor-pointer flex items-center  w-120 bg-white p-1 rounded-full px-4">
        <Input
          type="text"
          placeholder="Search..."
          className="border-none"
        />
        <button type="submit" className="text-gray-600 hover:cursor-pointer ">
          <IoIosSearch size={24} />
        </button>
      </form>
    </>
  )
}

export default SearchBar