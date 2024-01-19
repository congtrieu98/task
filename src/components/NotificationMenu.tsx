"use client";

import { useState, useRef, useEffect } from "react";
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react-notification-feed";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react-notification-feed/dist/index.css";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";

const YourAppLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && status === "authenticated" ? (
    <KnockFeedProvider
      apiKey={"pk_test_2LCxRA4sLbMOOWkhzOHTR8W3g-FsgQ9BOzbKQXGZ7RU"}
      feedId={"3bb527bb-cf64-4a00-98e6-81c6d1e24b9d"}
      userId={session?.user?.id as string}
      // In production, you must pass a signed userToken
      // and enable enhanced security mode in your Knock dashboard
      // userToken={currentUser.knockUserToken}
    >
      <>
        <NotificationIconButton
          ref={notifButtonRef}
          onClick={(e) => setIsVisible(!isVisible)}
        />
        <NotificationFeedPopover
          buttonRef={notifButtonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </>
    </KnockFeedProvider>
  ) : (
    <Bell />
  );
};

export default YourAppLayout;