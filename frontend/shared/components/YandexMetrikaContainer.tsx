"use client";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const YM_COUNTER_ID = 106291662; // Ваш ID счётчика

const YandexMetrikaContainer = ({ enabled }: { enabled: boolean }) => {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(YM_COUNTER_ID, 'hit', `${pathname}${search.toString() ? `?${search.toString()}` : ''}${window.location.hash}`);
    }
  }, [pathname, search]);

  if (!enabled) return null;

  return (
    <>
      <Script id="yandex-metrika">
        {`(function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106291662', 'ym');
        ym(${YM_COUNTER_ID}, "init", { defer: true, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`}
      </Script>
      <noscript>
        <div><img src={`https://mc.yandex.ru/watch/${YM_COUNTER_ID}`} style={{ position: 'absolute', left: '-9999px' }} alt="" /></div>
      </noscript>
    </>
  );
};

export default YandexMetrikaContainer;
