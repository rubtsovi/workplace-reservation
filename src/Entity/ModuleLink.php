<?php

namespace App\Entity;

class ModuleLink
{
    /**
     * @var string
     */
    private $title;

    /**
     * @var string
     */
    private $icon;

    /**
     * @var string
     */
    private $url;

    /**
     * @var string
     */
    private $role;

    /**
     * Get the value of title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set the value of title.
     *
     * @return self
     */
    public function setTitle(string $title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get the value of icon.
     *
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * Set the value of icon.
     *
     * @return self
     */
    public function setIcon(string $icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Get the value of url.
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set the value of url.
     *
     * @return self
     */
    public function setUrl(string $url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get the value of role.
     *
     * @return string
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * Set the value of role.
     *
     * @return self
     */
    public function setRole(string $role)
    {
        $this->role = $role;

        return $this;
    }
}
