import connectDB from "@/library/connectDB";
import User from "@/model/user";
import Shop from "@/model/shop";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import product from "@/model/product";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized", sucess: false });
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
      return NextResponse.json({
        message: "Every data is required",
        sucess: false,
      });
    }

    const files = [
      formData.get("file1"),
      formData.get("file2"),
      formData.get("file3"),
      formData.get("file4"),
      formData.get("file5"),
    ];

    const invalidFiles = files.filter(
      (file) =>
        !(file instanceof File) ||
        !file.type.startsWith("image/") ||
        file.size === 0
    );

    if (invalidFiles.length > 0) {
      return NextResponse.json(
        {
          message: "All 5 image files must be valid and non-empty",
          sucess: false,
        }
      );
    }


    console.log("jjjjjjjjjjj");
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

    return NextResponse.json({
      message: "Product and files uploaded successfully",
      newProduct,
      sucess: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
      sucess: false,
    });
  }
}
