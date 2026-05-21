"use client";

import { collectionsApi } from "@/entities/collections/api/collections.api";
import { Card, Container } from "@/shared/ui";
import { getIcon } from "@/shared/utils/getIcon";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function CollectionPage() {
  const { collectionId } = useParams();
  const { data, isLoading } = useQuery(
    collectionsApi.getCollectionById(collectionId as string)
  );

  const Icon = getIcon(data?.icon);

  return (
    <Card>
      <Container maxWidth="md">
        {isLoading ? (
          <div>
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="relative text-3xl mb-3">
              <span className="absolute top-0 -translate-x-full pr-5">
                {Icon && <Icon color={data.iconColor} size={40} />}
              </span>
              {data?.title}
            </h1>
            <p>{data?.description}</p>
          </div>
        )}
      </Container>
    </Card>
  );
}
