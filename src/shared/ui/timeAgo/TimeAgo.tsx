"use client";

import ReactTimeAgo, { type Props as ReactTimeAgoProps } from "react-timeago";
import { makeIntlFormatter } from "react-timeago/defaultFormatter";

export default function TimeAgo({ ...props }: ReactTimeAgoProps) {
  const intlFormatter = makeIntlFormatter({
    locale: "ru",
    style: "short",
  });

  return <ReactTimeAgo live={false} {...props} formatter={intlFormatter} />;
}
