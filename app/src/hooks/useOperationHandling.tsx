import { useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { getErrorDescription } from "../utils/getErrorDescription";

export function useOperationHandling<T>(
  executable: (...args: any) => Promise<T>,
  errorTitle: string = "Error"
) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const invoke = useCallback(async (...args: any) => {
    setLoading(true);
    try {
      let res = await executable(...args);
      setLoading(false);
      return res;
    } catch (error) {
      console.log(error);
      toast({
        title: errorTitle,
        description: getErrorDescription(error),
        status: "error",
      });
      setLoading(false);
    }
  }, []);

  return { loading, invoke };
}
