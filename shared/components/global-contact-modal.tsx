"use client";

import { useEffect, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

export default function GlobalContactModal() {
  const [open, setOpen] = useState(false);
  const [isVerified, setIsverified] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    business_name: "",
    request: "",
    description: "",
  });

  useEffect(() => {
    const handleHashOpen = () => {
      if (window.location.hash === "#contact-modal") {
        setOpen(true);
      }
    };

    handleHashOpen();
    window.addEventListener("hashchange", handleHashOpen);
    return () => window.removeEventListener("hashchange", handleHashOpen);
  }, []);

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!isVerified) {
      toast("Verifica hCaptcha fallita, Per favore, completa hCaptcha.");
      return;
    }

    fetch("/api/contactform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        toast(
          "Richiesta di contatto registrata con successo, a breve verrà contattato da uno dei nostri operatori"
        );
        setOpen(false);
      });
  }

  async function handleCaptchaSubmission(token: string) {
    if (!token) {
      setIsverified(false);
      return;
    }

    const request = fetch("/api/captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "h-captcha-response": token,
      }),
    });

    const response = await request;
    let data: { success?: boolean; message?: string } | null = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok || !data?.success) {
      setIsverified(false);
      toast(data?.message ?? "Verifica hCaptcha fallita, riprova.");
      return;
    }

    setIsverified(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contattaci</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="global-contact-email">Email</Label>
            <Input
              id="global-contact-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="global-contact-name">Nome</Label>
            <Input
              id="global-contact-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="global-contact-surname">Cognome</Label>
            <Input
              id="global-contact-surname"
              type="text"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="global-contact-business-name">Azienda</Label>
            <Input
              id="global-contact-business-name"
              type="text"
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="global-contact-request">Richiesta</Label>
            <Input
              id="global-contact-request"
              type="text"
              value={formData.request}
              onChange={(e) => setFormData({ ...formData, request: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="global-contact-description">Descrizione</Label>
            <Textarea
              id="global-contact-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={handleCaptchaSubmission}
              onExpire={() => setIsverified(false)}
              onError={() => setIsverified(false)}
            />
            <p className="text-xs my-2">
              Cliccando "Invia" si dichiara di aver preso visione dell&apos;informativa
              per il trattamento dei dati personali.
            </p>
          </div>

          <Button type="submit" size="sm" className="px-3" onClick={handleSubmit}>
            Invia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
