import connectDB from "@/library/connectDB";
import User from "@/model/user";
import Shop from "@/model/shop";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import product from "@/model/product";
import jwt from "jsonwebtoken";

function generateFileName(originalName) {
  const timestamp = Date.now();
  const ext = path.extname(originalName);
  return `${timestamp}-${Math.random().toString(36).slice(2)}${ext}`;
}

async function addFile(file, uploadDir) {
  if (!file || typeof file === "string") return null;

  const newFileName = generateFileName(file.name);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadPath = path.join(uploadDir, newFileName);
  await writeFile(uploadPath, buffer);
  return newFileName;
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const user = await User.findById(userId);
    const shopId = user.shopId;

    const formData = await request.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const realPrice = formData.get("realPrice");
    const category = formData.get("category");
    const stockQuantity = formData.get("stockQuantity");

    if (
      !name ||
      !price ||
      !description ||
      !realPrice ||
      !category ||
      !stockQuantity
    ) {
      return Response.json({ message: "Every data is required" });
    }

    const files = [
      formData.get("file1"),
      formData.get("file2"),
      formData.get("file3"),
      formData.get("file4"),
      formData.get("file5"),
    ];

    if (files.some((file) => !file || typeof file === "string")) {
      return Response.json({ message: "All 5 files must be provided" });
    }

    const folderName = Date.now().toString();
    const uploadDir = path.join(process.cwd(), "public", "uploads", folderName);
    await mkdir(uploadDir, { recursive: true });

    const imageFileNames = [];
    for (const file of files) {
      const fileName = await addFile(file, uploadDir);
      imageFileNames.push(fileName);
    }

    const newProduct = new product({
      name,
      price,
      realPrice,
      description,
      category,
      folderName,
      shopId,
      stockQuantity,
      image: imageFileNames,
    });

    await newProduct.save();

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { $push: { products: newProduct._id } },
      { new: true }
    );

    return Response.json({
      message: "Product and files uploaded successfully",
      newProduct,
    });
   } catch (error) {
     return Response.json({ message: "Internal Server Error" });
   }
}
