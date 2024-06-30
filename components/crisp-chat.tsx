"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("e847af38-35f4-438a-88da-f273c6cf3bcc");
    }, []);

    return null;
}