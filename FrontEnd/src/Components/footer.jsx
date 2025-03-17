import React, { useState } from "react";
import { useTranslation } from "../TranslationContext";
import "./footer.css";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const { translations } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <footer class="bg-light mt-5 p-5">
        <div class="footer py-4 p-5">
          <div class="row p-5">
            <div class="col-md-4">
              <h5 class="contInfo">{translations.contInfo}</h5>
              <ul class="list-unstyled">
                <li>
                  <i class="bi bi-telephone-fill me-2"></i>
                  <a href="tel:+20 10 09252297" class="text-dark">
                    +20 10 09252297
                  </a>
                </li>
                <li>
                  <i class="bi bi-envelope-fill me-2 "></i>
                  <a
                    href="mailto:charmicompany4wi@gmail.com"
                    class="email text-dark">
                    charmicompany4wi@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5 class="qlinks">{translations.qlinks}</h5>
              <ul class="list-unstyled">
                <li>
                  <a onClick={() => navigate("/")} class="home text-dark">
                    {translations.home}
                  </a>
                </li>
                <li>
                  <a onClick={() => navigate("/about")} class="about text-dark">
                    {translations.about}
                  </a>
                </li>
                <li>
                  <a href="#" class="products text-dark">
                    {translations.products}
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => navigate("/contact")}
                    class="contact text-dark">
                    {translations.contact}
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5 class="follow">{translations.follow}</h5>
              <ul class="list-inline">
                <li class="list-inline-item">
                  <a
                    href="https://www.facebook.com/people/%D8%AA%D8%B4%D8%A7%D8%B1%D9%85%D9%8A-%D9%84%D9%84%D9%85%D8%B7%D8%A7%D8%A8%D8%AE-%D9%88%D8%A7%D9%84%D8%A7%D8%AB%D8%A7%D8%AB-%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84%D9%8A/100064863465749/?mibextid=ZbWKwL"
                    class="text-dark">
                    <i class="bi bi-facebook fs-3"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="https://www.instagram.com/charmi.wi/?igsh=cTVxMTRpbzUxZmxx#"
                    class="text-dark">
                    <i class="bi bi-instagram fs-3"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="https://www.youtube.com/@chrmi.w" class="text-dark">
                    <i class="bi bi-youtube fs-3"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="https://l.instagram.com/?u=https%3A%2F%2Fwww.linkedin.com%2Fposts%2Fcult-business-solutions_cultagency-cultkit-webdevelopment-activity-7219334971071614977-qQtx%3Futm_source%3Dshare%26utm_medium%3Dmember_ios&e=AT2QMx83EKAxrICxeQ2vOywP5KKmjxH6sdcQ9CuwEnk8dtD8XrBI_QFZ5ucQuRYfR1-AwQPwQ3RJQkfY1YaEZzRr71Ajzs8d6q9nCw"
                    class="text-dark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      class="bi bi-snapchat"
                      viewBox="0 0 16 16"
                      style={{ marginTop: 5 }}>
                      <path d="M15.943 11.526c-.111-.303-.323-.465-.564-.599a1 1 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.4 3.4 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.3.3 0 0 1 .097-.1c.129-.086.262-.173.352-.231.162-.104.289-.187.371-.245.309-.216.525-.446.66-.702a1.4 1.4 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.8 1.8 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139-.116-1.344-.587-2.048-1.077-2.61a4.3 4.3 0 0 0-1.095-.881C9.764.216 8.92 0 7.999 0s-1.76.216-2.505.641c-.412.232-.782.53-1.097.883-.49.562-.96 1.267-1.077 2.61-.033.382-.04.772-.036 1.138a1.8 1.8 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.4 1.4 0 0 0 .067 1.161c.136.256.352.486.66.701.082.058.21.14.371.246l.339.221a.4.4 0 0 1 .109.11c.026.053.027.11-.012.217a3.4 3.4 0 0 1-.295.52c-.398.583-.968 1.077-1.696 1.472-.385.204-.786.34-.955.8-.128.348-.044.743.28 1.075q.18.189.409.31a4.4 4.4 0 0 0 1 .4.7.7 0 0 1 .202.09c.118.104.102.26.259.488q.12.178.296.3c.33.229.701.243 1.095.258.355.014.758.03 1.217.18.19.064.389.186.618.328.55.338 1.305.802 2.566.802 1.262 0 2.02-.466 2.576-.806.227-.14.424-.26.609-.321.46-.152.863-.168 1.218-.181.393-.015.764-.03 1.095-.258a1.14 1.14 0 0 0 .336-.368c.114-.192.11-.327.217-.42a.6.6 0 0 1 .19-.087 4.5 4.5 0 0 0 1.014-.404c.16-.087.306-.2.429-.336l.004-.005c.304-.325.38-.709.256-1.047m-1.121.602c-.684.378-1.139.337-1.493.565-.3.193-.122.61-.34.76-.269.186-1.061-.012-2.085.326-.845.279-1.384 1.082-2.903 1.082s-2.045-.801-2.904-1.084c-1.022-.338-1.816-.14-2.084-.325-.218-.15-.041-.568-.341-.761-.354-.228-.809-.187-1.492-.563-.436-.24-.189-.39-.044-.46 2.478-1.199 2.873-3.05 2.89-3.188.022-.166.045-.297-.138-.466-.177-.164-.962-.65-1.18-.802-.36-.252-.52-.503-.402-.812.082-.214.281-.295.49-.295a1 1 0 0 1 .197.022c.396.086.78.285 1.002.338q.04.01.082.011c.118 0 .16-.06.152-.195-.026-.433-.087-1.277-.019-2.066.094-1.084.444-1.622.859-2.097.2-.229 1.137-1.22 2.93-1.22 1.792 0 2.732.987 2.931 1.215.416.475.766 1.013.859 2.098.068.788.009 1.632-.019 2.065-.01.142.034.195.152.195a.4.4 0 0 0 .082-.01c.222-.054.607-.253 1.002-.338a1 1 0 0 1 .197-.023c.21 0 .409.082.49.295.117.309-.04.56-.401.812-.218.152-1.003.638-1.18.802-.184.169-.16.3-.139.466.018.14.413 1.991 2.89 3.189.147.073.394.222-.041.464" />
                    </svg>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="https://tr.ee/-VwszGX1V0" class="text-dark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      class="bi bi-tiktok"
                      viewBox="0 0 16 16"
                      style={{ marginTop: 5 }}>
                      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
