import React from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  { children?: React.ReactNode }
>(({ children }, ref) => {
  return (
    <Button ref={ref} size={"sm"} disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {children ? children : "ກະລຸນາລໍຖ້າ"}
    </Button>
  );
});

export default LoadingButton;
