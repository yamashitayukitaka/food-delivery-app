interface Params {
  restaurantId: string;
}

export default function RestaurantPage({
  searchParams,
  params,
}: {
  searchParams: { sessionToken: string }; // Promise不要
  params: Params; // Promise不要
}) {
  const { sessionToken } = searchParams;

  console.log(sessionToken);
  console.log(params.restaurantId);

  return (
    <div>
      RestaurantPage
    </div>
  );
}

