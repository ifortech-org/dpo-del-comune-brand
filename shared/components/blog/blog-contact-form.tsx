"use client";

import Image from "next/image";
import { useState } from "react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { POST_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/shared/sanity/lib/image";
import { Button } from "@/shared/components/ui/button";
import { HCaptcha } from "@/shared/components/ui/hcaptcha";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

type BlogContactFormProps = {
  image?: NonNullable<POST_QUERYResult>["image"];
  title?: string;
  content?: string;
  buttonText?: string;
};

export default function BlogContactForm({
  image,
  title = "Vuoi saperne di più?",
  content = "Contattaci per richiedere supporto e assistenza professionale sulla gestione della Sicurezza dei Dati, dell'applicazione delle regole del GDPR e la Cybersecurity.",
  buttonText = "Contattaci",
}: BlogContactFormProps) {
  const hasImage = Boolean(image && image.asset?._id);
  const imageUrl = hasImage ? urlFor(image!).quality(100).url() : "";
  const [isVerified, setIsverified] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    business_name: "",
    request: "",
    description: "",
  });

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
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
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        business_name: formData.business_name,
        request: formData.request,
        description: formData.description,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast(
          "Richiesta di contatto registrata con successo, a breve verrà contattato da uno dei nostri operatori",
        );
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
    if (!response.ok) {
      setIsverified(false);
      return;
    }

    const data = await response.json();
    setIsverified(Boolean(data?.success));
  }

  return (
    <Dialog>
      <div
        className={`my-10 md:my-12 grid gap-6 overflow-hidden rounded-2xl border border-primary/10 bg-muted ${
          hasImage ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : ""
        }`}>
        {hasImage && (
          <div className="relative min-h-[220px] md:min-h-full">
            <Image
              src={imageUrl}
              alt={image?.alt || ""}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
              placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || undefined}
            />
          </div>
        )}
        <div className="flex flex-col justify-between gap-4 p-6 md:p-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm md:text-base text-foreground">
              {content}
            </p>
          </div>
          <DialogTrigger asChild>
            <Button>{buttonText}</Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contattaci</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="surname">Cognome</Label>
            <Input
              id="surname"
              type="text"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="business_name">Azienda</Label>
            <Input
              id="business_name"
              type="text"
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="request">Richiesta</Label>
            <Input
              id="request"
              type="text"
              value={formData.request}
              onChange={(e) =>
                setFormData({ ...formData, request: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <HCaptcha
              siteKey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={handleCaptchaSubmission}
            />
            <p className="text-xs my-2">
              Cliccando "Invia" si dichiara di aver preso visione
              dell’informativa per il trattamento dei dati personali.
            </p>
          </div>

          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={handleSubmit}>
            Invia
          </Button>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
