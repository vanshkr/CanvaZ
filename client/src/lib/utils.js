import jsPDF from "jspdf";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

// Adjective list for random name generator
const adjectives = [
  "Happy",
  "Creative",
  "Energetic",
  "Lively",
  "Dynamic",
  "Radiant",
  "Joyful",
  "Vibrant",
  "Cheerful",
  "Sunny",
  "Sparkling",
  "Bright",
  "Shining",
];

// Animal list for random name generator
const animals = [
  "Dolphin",
  "Tiger",
  "Elephant",
  "Penguin",
  "Kangaroo",
  "Panther",
  "Lion",
  "Cheetah",
  "Giraffe",
  "Hippopotamus",
  "Monkey",
  "Panda",
  "Crocodile",
];

// Merge classnames utility using clsx + tailwind-merge
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Generate a random name like "Happy Tiger"
export function generateRandomName() {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdjective} ${randomAnimal}`;
}

// Return shape icon and label by shape type
export const getShapeInfo = (shapeType) => {
  switch (shapeType) {
    case "rect":
      return { icon: "/assets/rectangle.svg", name: "Rectangle" };
    case "circle":
      return { icon: "/assets/circle.svg", name: "Circle" };
    case "triangle":
      return { icon: "/assets/triangle.svg", name: "Triangle" };
    case "line":
      return { icon: "/assets/line.svg", name: "Line" };
    case "i-text":
      return { icon: "/assets/text.svg", name: "Text" };
    case "image":
      return { icon: "/assets/image.svg", name: "Image" };
    case "freeform":
      return { icon: "/assets/freeform.svg", name: "Free Drawing" };
    default:
      return { icon: "/assets/rectangle.svg", name: shapeType };
  }
};

// Export canvas content to a downloadable PDF using jsPDF
export const exportToPdf = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  const data = canvas.toDataURL("image/png");
  doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);
  doc.save("canvas.pdf");
};
