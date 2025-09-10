import { MotionProps } from "motion/react";
import * as motion from "motion/react-client";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { decryptAesBase64 } from "../../../encrypt.utils";

type BusinessScene = { 
  id: string;
  businessId: number;
  boothId: string | null;
  eventId: string | null;
  sceneKey: string;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
  is_active: boolean;
};

const ThreeDPage = async () => {
  const sceneEndpoint = "https://arobid-3d-scene-staging.arobid.site";
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const businessId = cookieStore.get("businessId")?.value;
  const key = cookieStore.get('key')?.value
  const key2 = cookieStore.get('key2')?.value
  
  if (!token) {
    redirect("/login");
  }

  const sceneListRes = await fetch(`${sceneEndpoint}/api/aro3d/scenes`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": key || '',
    },
  });

  const sceneListRes2 = await fetch(
    `${sceneEndpoint}/api/scenes/businesses/${businessId}`
  );
  const sceneListData2 = await sceneListRes2.json();

  const activeScenes = sceneListData2.data.map((scene: BusinessScene) => decryptAesBase64(scene.sceneKey, key2 || ''))

  const editTokenRes = await fetch(`${sceneEndpoint}/api/aro3d/edit-token`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": key || '',
    },
  });
  const editTokenData = await editTokenRes.json();
  const sceneListData = await Promise.resolve({
    data: [
      {
        name: "arobid_booth_mobile",
        sceneUrl: "https://arobidglobal.shapespark.com/arobid_booth_mobile/",
        assetsUrl:
          "https://cdn0.shapespark.com/521xWCxkxj7h/arobid_booth_mobile/v11/",
        viewCount: 860,
        visibility: "public",
        downloadable: true,
        source: "File:Assimp",
        hasDraftChanges: false,
        published: true,
        modificationDate: "2025-07-28T06:25:52.255877+00:00",
        meetings: [
          {
            joinUrl:
              "https://arobidglobal.shapespark.com/arobid_booth_mobile/#meeting-key=mMyHlaocXTbZFMuv",
          },
        ],
      },
      {
        name: "arobid_booth_mobile-test",
        sceneUrl:
          "https://arobidglobal.shapespark.com/arobid_booth_mobile-test/",
        assetsUrl:
          "https://cdn0.shapespark.com/521xWCxkxj7h/arobid_booth_mobile-test/v18/",
        viewCount: 97,
        visibility: "public",
        downloadable: true,
        source: "File:Assimp",
        hasDraftChanges: false,
        published: true,
        modificationDate: "2025-08-01T09:56:55.035637+00:00",
        meetings: null,
      },
    ],
  });

  type Scene = {
    name: string;
    sceneUrl: string;
    assetsUrl: string;
    viewCount: number;
    visibility: string;
  };

  const motionProps: MotionProps = {
    transition: {
      type: "spring",
    },
    initial:{ x: -5 },
    animate:{ x: [5, 0] },
  };

  return (
    <motion.div className="h-screen container p-4 mx-auto" {...motionProps}>
      <motion.h1
        {...motionProps}
        className="text-2xl font-bold mb-4"
      >
        3D Scene List
      </motion.h1>
      <motion.ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" {...motionProps}>
        {sceneListData.data.filter((scene: Scene) => activeScenes.includes(scene.name)).map((scene: Scene) => {
          return (
          <motion.li drag dragSnapToOrigin whileDrag={{ scale: 0.9 }} className="relative" key={scene.name} {...motionProps}>
            <motion.div className="card bg-base-100 image-full w-96 shadow-sm" {...motionProps}>
              <motion.figure {...motionProps}>
                <Image
                  src={scene.assetsUrl + "thumbnail.jpg"}
                  alt={scene.name}
                  width={384}
                  height={384}
                  unoptimized
                />
              </motion.figure>
              <motion.div {...motionProps} className="card-body flex flex-col justify-between">
                <motion.h2 {...motionProps} className="card-title">{scene.name}</motion.h2>
                <motion.div {...motionProps} className="card-actions justify-end">
                  <div  className="join border border-gray-300/30 rounded-md">
                  <Link href={scene.sceneUrl} className="btn btn-sm btn-info join-item hover:scale-105">
                    View
                  </Link>
                  <Link
                    href={
                      scene.sceneUrl +
                      "draft/open?token=" +
                      editTokenData.data +
                      "&next=editor"
                    }
                    className="btn btn-sm btn-neutral join-item hover:scale-105"
                  >
                    Edit
                  </Link>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.li>
        )})}
      </motion.ul>
    </motion.div>
  );
};

export default ThreeDPage;
