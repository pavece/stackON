import { Github } from "lucide-react";
import { Button } from "./button";

export const NavBar = () => {
  return (
    <nav className="mb-10 flex justify-between">
      <img src="/images/logo.svg" alt="StackON logo" className="w-[140px]" />

      <Button asChild className="cursor-pointer" variant="ghost">
        <a href="https://github.com/pavece/stackON" rel="noopneer noreferer" target="blank">
          <Github /> GitHub
        </a>
      </Button>
    </nav>
  );
};
