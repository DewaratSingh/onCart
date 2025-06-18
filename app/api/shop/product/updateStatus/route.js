import connectDB from "@/library/connectDB";
import Order from "@/model/order";

export async function POST(request) {
  try {
    await connectDB();

    const { status, orderId } = await request.json();

    if (!status) {
      return Response.json({ message: "Status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status });

    if (!updatedOrder) {
      return Response.json({ message: "Order not found" });
    }

    return Response.json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error in updateStatus API:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
