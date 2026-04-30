<template>
  <a-extract-style>
    <a-config-provider :locale="zhCN" :theme="adminTheme">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </a-config-provider>
  </a-extract-style>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const adminTheme = {
  token: {
    borderRadius: 8,
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBorder: '#d9e2ef',
    colorError: '#dc2626',
    colorInfo: '#3166da',
    colorPrimary: '#3166da',
    colorSuccess: '#16a34a',
    colorText: '#111827',
    colorTextSecondary: '#4b5563',
    colorTextTertiary: '#6b7280',
    colorWarning: '#d97706',
    boxShadow: '0 12px 28px rgb(15 23 42 / 8%)',
  },
  components: {
    Button: {
      defaultShadow: 'none',
      dangerShadow: 'none',
      primaryShadow: 'none',
    },
    Card: {
      borderRadiusLG: 12,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#4b5563',
    },
  },
}
</script>
