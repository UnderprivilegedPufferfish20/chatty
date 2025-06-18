const Page = ({ params }: { params: { receiverId: string } }) => {
  const receiverId = params.receiverId;

  console.log("Receiver ID: ", receiverId);

  return <p>{receiverId}</p>;
};

export default Page
