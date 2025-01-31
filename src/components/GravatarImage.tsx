import React from "react";
import md5 from "md5";

interface GravatarImageProps {
  email: string;
  size?: number;
  defaultImage?: string;
}

const GravatarImage: React.FC<GravatarImageProps> = ({
  email,
  size = 100,
  defaultImage = "identicon",
}) => {
  // Convertir email a minúsculas y eliminar espacios
  const emailFormatted = email.trim().toLowerCase();
  // Generar hash MD5 del email
  const emailHash = md5(emailFormatted);
  // Construir la URL de Gravatar
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=${defaultImage}`;

  return (
    <img
      src={gravatarUrl}
      alt="Gravatar"
      className="rounded-full border border-gray-300"
      width={size}
      height={size}
    />
  );
};

export default GravatarImage;
