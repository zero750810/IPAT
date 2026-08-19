<template>
  <div>
    <!-- 關於我們 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="關於我們" />
        <div class="row align-items-center mt-4">
          <div class="col-md-5">
            <img src="/img/about.jpg" class="img-fluid rounded" alt="關於我們" />
          </div>
          <div class="col-md-7">
            <p>本會為國際遊戲協會在台灣成立的分會，為認同國際遊戲協會之宗旨，在台依法設立、非以營利為目的之社會團體。</p>
            <p>我們的宗旨在促進兒童與家庭各年齡層的健康與教育福祉，以及依照聯合國兒童人權公約致力於保障所有兒童的遊戲權利。</p>
            <p>增強人際互動功能，開展閒暇時間利用和遊戲學習方案，並著力於改善與提供遊戲環境、發展遊具、玩物與遊戲空間，國際遊戲協會台灣分會提供一個國際論壇平台，促進所有兒童、青年直至銀髮樂齡者之遊戲權利與機會。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 本會組織 -->
    <section class="py-5 bg-light">
      <div class="container">
        <SectionTitle title="本會組織" />
        <div class="row align-items-center mt-4">
          <div class="col-md-6">
            <img
              src="/img/Organizational.jpg"
              class="img-fluid rounded"
              alt="組織架構"
            />
          </div>
          <div class="col-md-6">
            <ul class="list-unstyled fs-5">
              <li class="mb-2"><strong>理事長：</strong>吳煌榮</li>
              <li class="mb-2">
                <strong>副理事長：</strong>王偵權、張宇文、廖惠君
              </li>
              <li class="mb-2">
                <strong>常務理事：</strong>張世宗、吳煌榮、張宇文
              </li>
              <li class="mb-2"><strong>常務監事：</strong>蔡延治</li>
              <li class="mb-2">
                <strong>理事：</strong>陳淑芳、洪新富、林三元、梁國棟
              </li>
              <li class="mb-2"><strong>監事：</strong>林士真、莊琬琦</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import SectionTitle from '../components/SectionTitle.vue'
</script>
